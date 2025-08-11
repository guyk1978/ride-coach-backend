const express = require('express');
const router = express.Router();
const pool = require('./db'); // MySQL connection pool

// GET all plans
router.get('/', async (req, res) => {
  // בדיקה אם קיים פרמטר email בשאילתה
  const email = req.query.email;

  if (email) {
    // אם יש אימייל, מחזירים את התוכנית של המשתמש
    try {
      const [rows] = await pool.query('SELECT * FROM user_plans WHERE email = ?', [email]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      const plan = rows[0];
      plan.goals = plan.goals.split(',');

      return res.json(plan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Database error' });
    }
  } else {
    // אם אין פרמטר email, מחזירים את כל התוכניות
    try {
      const [rows] = await pool.query('SELECT * FROM user_plans ORDER BY created_at DESC');
      return res.json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Database error' });
    }
  }
});

// POST create or update plan
router.post('/', async (req, res) => {
  const { email, goals, weeklyHours, difficulty } = req.body;

  if (!email || !goals || !weeklyHours || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const goalsStr = Array.isArray(goals) ? goals.join(',') : goals;

    const [rows] = await pool.query('SELECT * FROM user_plans WHERE email = ?', [email]);

    if (rows.length > 0) {
      await pool.query(
        'UPDATE user_plans SET goals = ?, weekly_hours = ?, difficulty = ?, created_at = NOW() WHERE email = ?',
        [goalsStr, weeklyHours, difficulty, email]
      );
    } else {
      await pool.query(
        'INSERT INTO user_plans (email, goals, weekly_hours, difficulty) VALUES (?, ?, ?, ?)',
        [email, goalsStr, weeklyHours, difficulty]
      );
    }

    res.json({ message: 'Plan saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE a plan by email
router.delete('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM user_plans WHERE email = ?', [email]);
    if (result.affectedRows > 0) {
      res.json({ message: `Plan for ${email} deleted successfully` });
    } else {
      res.status(404).json({ error: 'Plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
