import React, { useState } from "react";
import Sidebar from '../Layouts/SideNav';
import Header from '../Layouts/SidebarHeader';

const MeetixEmbedIntegrationDocs = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const storedUser = localStorage.getItem("user")

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generateToken = async () => {
    setCopied(false);
    try {
      const res = await fetch("http://localhost:3010/api/v1/user/generate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUser._id })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setError("");
      } else {
        setError("Token generation failed.");
      }
    } catch (err) {
      setError("Server not reachable or invalid response.");
    }
  };

  const embedCode = `<iframe
  src="https://devloper.mahitechnocrafts.in/?token=${token}"
  width="100%"
  height="600"
  frameborder="0"
  allow="camera; microphone; fullscreen">
</iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="MEETIX Embed API Docs" />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto px-6 py-12 bg-gradient-to-b from-white to-slate-50 text-gray-800">
            <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
              🔗 MEETIX Integration & Embedding Guide
            </h1>

            <section className="mb-10 text-center">
              <p className="text-lg leading-relaxed">
                MEETIX is a powerful video conferencing platform that allows seamless integration
                of live video experiences into any website or application. Whether you're building
                a learning management system, a telemedicine app, or simply want to integrate
                virtual meetings into your product, MEETIX gives you the flexibility and
                scalability to embed video rooms using a simple iframe. In this guide, we will walk
                you through the step-by-step process of generating a secure token and using it to
                embed MEETIX into your own platform.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-2 text-indigo-600">STEP 1: Generate Your Secure Token</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Every MEETIX embed requires a unique token. This token is used to validate the
                session and authorize the user accessing the meeting. You do not need to input any
                form — simply click the button below and MEETIX will generate a token for you. This
                token is valid for 30 days and can be used in any secure embed session on your
                website.
              </p>
              <button
                onClick={generateToken}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all"
              >
                🚀 Generate Access Token
              </button>

              {error && <p className="mt-4 text-red-600">{error}</p>}

              {token && (
                <div className="mt-6">
                  <label className="font-semibold">Your Access Token:</label>
                  <textarea
                    readOnly
                    className="w-full mt-2 p-3 bg-gray-100 rounded border text-sm"
                    rows="3"
                    value={token}
                  />
                </div>
              )}
            </section>

            {token && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-2 text-indigo-600">STEP 2: Embed MEETIX in Your Webpage</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Once you have your token, you can now embed the MEETIX video room into any HTML
                  page using an iframe. This is extremely simple and effective. Just paste the
                  following iframe snippet into your page’s HTML or component.
                </p>

                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full font-mono bg-gray-100 rounded p-4 border text-sm h-40 resize-none"
                    value={embedCode}
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-xs"
                  >
                    {copied ? "✅ Copied" : "📋 Copy Code"}
                  </button>
                </div>
              </section>
            )}

            {token && (
              <section>
                <h2 className="text-2xl font-semibold mb-2 text-indigo-600">STEP 3: Embed Anywhere & Customize</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  The iframe is now ready to be embedded into any modern frontend stack. Whether
                  you’re using React, Angular, Vue, plain HTML or even platforms like Webflow or
                  WordPress, you can paste the iframe directly and MEETIX will handle everything —
                  including audio/video permissions, UI rendering, device selection and more.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 text-sm">
                  Optional Parameters:<br />
                  <code>&theme=dark</code> – Switch to dark mode<br />
                  <code>&lang=hi</code> – Set language to Hindi<br />
                  <br />
                  Example: <code>https://devloper.mahitechnocrafts.in?token=eyXYZ123</code>
                </div>
              </section>
            )}

            <section className="mt-16">
              <h2 className="text-xl font-semibold text-indigo-600 mb-4">Frequently Asked Questions</h2>
              <ul className="space-y-6 text-gray-700 leading-relaxed">
                <li>
                  <strong>Can I embed MEETIX in a React or Next.js app?</strong><br />
                  Yes. The iframe works with any frontend framework. Just insert the iframe in your JSX or HTML code.
                </li>
                <li>
                  <strong>Can I revoke a token?</strong><br />
                  Currently, tokens are valid for 30 days. If you need to expire it earlier, delete it from the server or issue a new one.
                </li>
                <li>
                  <strong>Does the embed support responsive layouts?</strong><br />
                  Yes. Set width="100%" and use media queries or a responsive wrapper.
                </li>
                <li>
                  <strong>Can I embed multiple meetings on the same page?</strong><br />
                  Technically yes, but we recommend one active instance per user session.
                </li>
              </ul>
            </section>

            <footer className="mt-20 text-center text-sm text-gray-500">
              Need support? Contact us at <a href="mailto:support@meetix.in" className="text-indigo-600 underline">support@meetix.in</a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetixEmbedIntegrationDocs;
