const express = require('express');
const router = express.Router();
const pool = require('./db');

router.post('/', async (req, res) => {
  const { email, goals, weeklyHours, difficulty } = req.body;

  if (!email || !goals || !weeklyHours || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const goalsStr = goals.join(',');

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
  console.error('Database error details:', error);
  res.status(500).json({ error: error.message });
}

});

// GET to retrieve plan by email
router.get('/:email', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user_plans WHERE email = ?', [req.params.email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = rows[0];
    plan.goals = plan.goals.split(',');

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
