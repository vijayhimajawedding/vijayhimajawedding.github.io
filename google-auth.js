/*====================================
    GOOGLE SIGN-IN (RSVP VERIFICATION)
====================================*/

const GOOGLE_CLIENT_ID = "184927237615-vntqsda2821cqul046mqp6pglbmrjgka.apps.googleusercontent.com";

// Decode the JWT credential Google returns so we can read the
// name/email it contains. This is a client-side read only, purely
// to display "signed in as ___" and pass the email along with the
// RSVP - it isn't a substitute for real server-side verification,
// but it's enough to attach a real Google identity to each RSVP.

function parseGoogleJwt(token){
    try{
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g,"+").replace(/_/g,"/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    }catch(e){
        console.error("Failed to parse Google credential", e);
        return null;
    }
}

function handleGoogleCredential(response){
    const payload = parseGoogleJwt(response.credential);
    if(!payload || !payload.email) return;

    document.getElementById("guestEmail").value = payload.email;
    document.getElementById("guestGoogleName").value = payload.name || "";

    const signedInAs = document.getElementById("googleSignedInAs");
    signedInAs.textContent = "✓ Verified as " + payload.name + " (" + payload.email + ")";
    signedInAs.classList.add("show");

    const signInDiv = document.getElementById("googleSignInDiv");
    if(signInDiv){
        signInDiv.style.display = "none";
    }

    const submitBtn = document.querySelector(".rsvp-btn");
    if(submitBtn){
        submitBtn.disabled = false;
    }
}

function initGoogleSignIn(){
    if(typeof google === "undefined" || !google.accounts){
        // Google Identity script hasn't loaded yet - try again shortly
        setTimeout(initGoogleSignIn, 300);
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential
    });

    const signInDiv = document.getElementById("googleSignInDiv");
    if(signInDiv){
        google.accounts.id.renderButton(
            signInDiv,
            {
                theme:"outline",
                size:"large",
                width:280,
                text:"continue_with"
            }
        );
    }

    // Note: we deliberately don't call google.accounts.id.prompt()
    // here, since that would trigger an automatic One Tap popup the
    // moment the page loads - while the intro video/seal-click
    // sequence is still showing. The rendered button inside the
    // RSVP form is enough, and appears naturally once a guest
    // scrolls down to RSVP.
}

window.addEventListener("load", initGoogleSignIn);
