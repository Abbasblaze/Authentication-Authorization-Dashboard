import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/users/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
     
        let user = await User.findOne({ 
          $or: [
            { email: email },
            { googleId: profile.id }
          ]
        });

        if (user) {
       
          if (!user.googleId) {
            user.googleId = profile.id;
            user.avatar = profile.photos[0]?.value || user.avatar;
            await user.save();
          }
          return done(null, user);
        }

 
        let username = profile.displayName.replace(/\s+/g, '').toLowerCase();
        let usernameExists = await User.findOne({ username });
        let counter = 1;
        
     
        while (usernameExists) {
          username = `${profile.displayName.replace(/\s+/g, '').toLowerCase()}${counter}`;
          usernameExists = await User.findOne({ username });
          counter++;
        }

      
        user = await User.create({
          username,
          email,
          googleId: profile.id,
          avatar: profile.photos[0]?.value,
        
        });

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;