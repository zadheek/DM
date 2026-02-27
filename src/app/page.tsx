import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Disaster Management System
          </h1>
          <p className="text-xl opacity-90">
            Community Support Platform for Sri Lanka
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to DMS
            </h2>
            <p className="text-gray-600 text-lg">
              A comprehensive platform for disaster preparedness, emergency response, 
              and community coordination during natural disasters.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                🚨 Emergency Reporting
              </h3>
              <p className="text-gray-700">
                Report emergencies with GPS location tracking for rapid response
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                💝 Donation Management
              </h3>
              <p className="text-gray-700">
                Track and manage relief donations with complete transparency
              </p>
            </div>

            <div className="p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                📢 Real-time Alerts
              </h3>
              <p className="text-gray-700">
                Receive disaster warnings and updates instantly
              </p>
            </div>

            <div className="p-6 bg-red-50 rounded-lg">
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                🚁 Rescue Coordination
              </h3>
              <p className="text-gray-700">
                Coordinate rescue operations and resource allocation efficiently
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Login to Dashboard
            </Link>
            <Link 
              href="/register"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
            >
              Register Now
            </Link>
            <Link 
              href="/donate"
              className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
            >
              Make a Donation
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-white mt-16 opacity-75">
          <p>© 2026 Disaster Management System | Developed by Liyana Kulathilake</p>
          <p className="text-sm mt-2">PUSL3190 Computing Project</p>
        </footer>
      </div>
    </div>
  );
}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
