const router = require('express').Router();
const Pin = require('../models/pin');

router.post('/', (req, res) => {
  const newPin = new Pin(req.body);
  newPin.save()
    .then((pin) => res.status(201).send(pin))
    .catch((err) => res.status(500).json(err));
});

router.get('/', (req, res) => {
  Pin.find()
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(500).json(err));
});

router.put('/', (req, res) => {
  Pin.findOneAndDelete({ username: req.body.username, title: req.body.title })
    .then((result) => res.status(204).send(result))
    .catch((err) => res.status(500).json(err));
});
module.exports = router;
