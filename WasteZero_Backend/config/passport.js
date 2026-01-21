import dotenv from "dotenv";
dotenv.config()
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import User from "../models/user.js";
const BACKEND = process.env.BACKEND_URL || "http://localhost:5173";
const OAUTH_CALLBACK_BASE = `${BACKEND}/api/auth/oauth/callback`;

// 🔹 Google Strategy (Optional - only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${OAUTH_CALLBACK_BASE}/google`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              provider: "google",
            });
          }

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  console.log("✅ Google OAuth strategy enabled");
} else {
  console.log("⚠️  Google OAuth disabled - credentials not found");
}

// 🔹 GitHub Strategy (Optional - only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy.Strategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${OAUTH_CALLBACK_BASE}/github`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              provider: "github",
            });
          }

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  console.log("✅ GitHub OAuth strategy enabled");
} else {
  console.log("⚠️  GitHub OAuth disabled - credentials not found");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
