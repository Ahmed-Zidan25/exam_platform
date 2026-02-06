import { Pool } from '@neondatabase/serverless'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export async function getUser(email: string) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0]
}

export async function getUserById(id: number) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id])
  return result.rows[0]
}

export async function getStudentProfile(userId: number) {
  const result = await query('SELECT * FROM student_profiles WHERE user_id = $1', [userId])
  return result.rows[0]
}

export async function createUser(email: string, passwordHash: string, fullName: string) {
  const result = await query(
    'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
    [email, passwordHash, fullName]
  )
  return result.rows[0]
}

export async function createStudentProfile(
  userId: number,
  grade: string,
  semester: string,
  subject: string,
  gender: string
) {
  const result = await query(
    'INSERT INTO student_profiles (user_id, grade, semester, subject, gender, completed_onboarding) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, grade, semester, subject, gender, true]
  )
  return result.rows[0]
}

export async function getExamById(id: number) {
  const result = await query('SELECT * FROM exams WHERE id = $1', [id])
  return result.rows[0]
}

export async function getQuestionsByExam(examId: number) {
  const result = await query(
    `SELECT q.*, json_agg(json_build_object('id', ao.id, 'text', ao.option_text, 'is_correct', ao.is_correct) ORDER BY ao.id) as answer_options
     FROM questions q
     LEFT JOIN answer_options ao ON q.id = ao.question_id
     WHERE q.exam_id = $1
     GROUP BY q.id
     ORDER BY q.id`,
    [examId]
  )
  return result.rows
}

export async function createExamAttempt(userId: number, examId: number) {
  const result = await query(
    'INSERT INTO exam_attempts (user_id, exam_id, started_at) VALUES ($1, $2, NOW()) RETURNING id',
    [userId, examId]
  )
  return result.rows[0]
}

export async function saveStudentAnswer(attemptId: number, questionId: number, selectedOptionId: number) {
  await query(
    'INSERT INTO student_answers (exam_attempt_id, question_id, selected_option_id) VALUES ($1, $2, $3)',
    [attemptId, questionId, selectedOptionId]
  )
}

export async function completeExamAttempt(attemptId: number, score: number, totalQuestions: number) {
  const result = await query(
    'UPDATE exam_attempts SET completed_at = NOW(), score = $1, total_questions = $2 WHERE id = $3 RETURNING *',
    [score, totalQuestions, attemptId]
  )
  return result.rows[0]
}

export async function getExamAttempts(userId: number, examId?: number) {
  let query_text = 'SELECT * FROM exam_attempts WHERE user_id = $1'
  const params: any[] = [userId]
  
  if (examId) {
    query_text += ' AND exam_id = $2'
    params.push(examId)
  }
  
  query_text += ' ORDER BY started_at DESC'
  
  const result = await query(query_text, params)
  return result.rows
}
