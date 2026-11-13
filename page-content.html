import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase.js";

function AccountPage() {
  const [mode, setMode] = useState("signup");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!auth) return undefined;

    return onAuthStateChanged(
      auth,
      setUser,
      (error) => showMessage(error.message, "error"),
    );
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!auth) {
      showMessage(
        "Firebase Authentication isn't configured. Add the Firebase settings to .env and restart the dev server.",
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    showMessage("");
    try {
      if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(credential.user, { displayName: name });
        await signOut(auth);
        setUser(null);
        setMode("login");
        setPassword("");
        showMessage("Your account is ready. Please sign in to continue.", "success");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.hash = "#home";
      }
    } catch (error) {
      showMessage(error.message || "We couldn't complete that request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      showMessage(
        "Firebase Authentication isn't configured. Add the Firebase settings to .env and restart the dev server.",
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    showMessage("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.hash = "#account";
    } catch (error) {
      showMessage(error.message || "We couldn't sign you in with Google.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!auth) {
      showMessage("Connect Firebase Authentication before requesting a password reset.", "error");
      return;
    }
    if (!email) {
      showMessage("Enter your email address first.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/#account`,
      });
      showMessage(
        "If an account exists for this email, a reset link is on its way.",
        "success",
      );
    } catch (error) {
      showMessage(error.message || "We couldn't send a password reset email.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      showMessage("You've been signed out.", "success");
    } catch (error) {
      showMessage(error.message || "We couldn't sign you out.", "error");
    }
  };

  return (
    <main className="account-page">
      <a className="account-back" href="#home">← Back to FounderStack</a>
      <section className="account-panel" aria-labelledby="account-title">
        <a className="account-wordmark" href="#home" aria-label="FounderStack home">
          <span className="wordmark-icon" aria-hidden="true"><i></i><i></i><i></i></span>
          founder<span>stack</span>
        </a>
        <p className="eyebrow"><span className="status-dot"></span> YOUR FOUNDERSTACK ACCOUNT</p>

        {user ? (
          <div className="account-signed-in">
            <h1 id="account-title">Your profile.</h1>
            <div className="account-profile">
              {user.photoURL ? (
                <img className="account-avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
              ) : (
                <span className="account-avatar account-avatar-fallback" aria-hidden="true">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </span>
              )}
              <div className="account-profile-details">
                <strong>{user.displayName || "FounderStack member"}</strong>
                <span>{user.email}</span>
              </div>
            </div>
            <a className="account-submit account-continue" href="#home">
              Continue to FounderStack <span aria-hidden="true">↗</span>
            </a>
            <button type="button" className="account-submit" onClick={handleSignOut}>Sign out</button>
            <p className={`account-message account-message-${messageType}`} aria-live="polite">
              {message || "Welcome to FounderStack."}
            </p>
          </div>
        ) : (
          <>
            {!isFirebaseConfigured && (
              <div className="account-setup-note" role="status">
                Connect Firebase Authentication to activate sign-up and login. Add your Firebase web app settings to <code>.env</code>, then restart the dev server.
              </div>
            )}
            <h1 id="account-title">{mode === "signup" ? "Create your account." : "Welcome back."}</h1>
            <p className="account-intro">
              {mode === "signup"
                ? "Join FounderStack to keep your projects and conversations close."
                : "Sign in to continue to your FounderStack account."}
            </p>
            <div className="account-tabs" role="tablist" aria-label="Account access">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={mode === "signup" ? "is-active" : ""}
                onClick={() => { setMode("signup"); showMessage(""); }}
              >
                Create account
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className={mode === "login" ? "is-active" : ""}
                onClick={() => { setMode("login"); showMessage(""); }}
              >
                Sign in
              </button>
            </div>
            <form className="account-form" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <label>
                  Full name
                  <input
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </label>
              )}
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  className="account-forgot"
                  onClick={sendPasswordReset}
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              )}
              <button className="account-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Please wait..."
                  : mode === "signup" ? "Create account" : "Sign in"}
                <span aria-hidden="true">↗</span>
              </button>
            </form>
            <div className="account-divider" aria-hidden="true"><span>OR</span></div>
            <button
              className="account-google"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
            >
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.73 6C44.43 38.08 46.98 31.96 46.98 24.55Z" />
                <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
              </svg>
              {isSubmitting ? "Please wait..." : "Continue with Google"}
            </button>
            <p
              className={`account-message account-message-${messageType}`}
              aria-live="polite"
              role={messageType === "error" ? "alert" : "status"}
            >
              {message || "Your account details are handled securely by Firebase."}
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default AccountPage;
