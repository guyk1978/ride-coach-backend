const express = require('express');
const router = express.Router();
const db = require('./db'); // כאן db הוא החיבור למסד

router.post('/', (req, res) => {
  const { email, goals, weeklyHours, difficulty } = req.body;

  if (!email || !goals || !weeklyHours || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const goalsStr = goals.join(',');

  db.query('SELECT * FROM user_plans WHERE email = ?', [email], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (rows.length > 0) {
      db.query(
        'UPDATE user_plans SET goals = ?, weekly_hours = ?, difficulty = ?, created_at = NOW() WHERE email = ?',
        [goalsStr, weeklyHours, difficulty, email],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Plan updated successfully' });
        }
      );
    } else {
      db.query(
        'INSERT INTO user_plans (email, goals, weekly_hours, difficulty) VALUES (?, ?, ?, ?)',
        [email, goalsStr, weeklyHours, difficulty],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Plan saved successfully' });
        }
      );
    }
  });
});

router.get('/:email', (req, res) => {
  db.query('SELECT * FROM user_plans WHERE email = ?', [req.params.email], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    const plan = rows[0];
    plan.goals = plan.goals.split(',');
    res.json(plan);
  });
});

module.exports = router;
