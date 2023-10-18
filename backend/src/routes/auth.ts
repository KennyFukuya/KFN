import express from "express";
import oauth from "passport-google-oauth";
import passport from "passport";
import database from "../database";

const GoogleStrategy = oauth.OAuth2Strategy;

const router = express.Router();

const clientID = process.env.CLIENT_ID as string;

const clientSecret = process.env.CLIENT_SECRET as string;

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "/oauth2/redirect/google",
    },
    function verify(issuer, profile, cb) {
      //   database.get(
      //     "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
      //     [issuer, profile.id],
      //     function (err, row) {
      //       if (err) {
      //         return cb(err);
      //       }
      //       if (!row) {
      //         database.run(
      //           "INSERT INTO users (name) VALUES (?)",
      //           [profile.displayName],
      //           function (err) {
      //             if (err) {
      //               return cb(err);
      //             }
      //             var id = this.lastID;
      //             database.run(
      //               "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)",
      //               [id, issuer, profile.id],
      //               function (err) {
      //                 if (err) {
      //                   return cb(err);
      //                 }
      //                 var user = {
      //                   id: id,
      //                   name: profile.displayName,
      //                 };
      //                 return cb(null, user);
      //               }
      //             );
      //           }
      //         );
      //       } else {
      //         database.get(
      //           "SELECT * FROM users WHERE id = ?",
      //           [row.user_id],
      //           function (err, row) {
      //             if (err) {
      //               return cb(err);
      //             }
      //             if (!row) {
      //               return cb(null, false);
      //             }
      //             return cb(null, row);
      //           }
      //         );
      //       }
      //     }
      //   );
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     cb(null, { id: user.id, username: user.username, name: user.name });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });

export default router;
