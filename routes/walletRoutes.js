const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/walletController');

router.get('/', ctrl.index);
router.get('/deposit', (req, res) => res.render('deposit'));
router.post('/deposit', ctrl.deposit);

router.get('/spend', (req, res) => res.render('spend'));
router.post('/spend', ctrl.spend);

router.get('/transfer', (req, res) => res.render('transfer'));
router.post('/transfer', ctrl.transfer);

module.exports = router;