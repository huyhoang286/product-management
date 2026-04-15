const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      const newUser = new User({
        googleId: profile.id,
        fullName: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        tokenUser: require('crypto').randomBytes(20).toString('hex'), 
        status: "active"
      });

      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));