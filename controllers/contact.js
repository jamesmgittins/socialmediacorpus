var secrets = require('../config/secrets');


/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var from = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var to = 'socialmediacorpus@gmail.com';
  var subject = 'Contact Form | Social Media Corpus';

  var mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };

  mandrill('/messages/send', {
    message: {
      to: [{email: to}],
      from_email: 'contact@SocialMediaCorpus.com',
      subject: subject,
      text: body
    }
  }, function(error, response) {
      if (error){
        console.log( JSON.stringify(error) );
        req.flash('errors', { msg: err.message });
        return res.redirect('/contact');
      }
      else console.log(response);
      req.flash('success', { msg: 'Email has been sent successfully!' });
      res.redirect('/contact');
  });
};