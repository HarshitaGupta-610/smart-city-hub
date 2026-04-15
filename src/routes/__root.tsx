import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { AppSidebar } from "../components/AppSidebar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold neon-text-blue">404</h1>
        <p className="mt-4 text-muted-foreground">System route not found.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Smart Pole – Intelligent Community Safety System" },
      { name: "description", content: "Advanced smart city control platform for intelligent community safety monitoring and management." },
      { property: "og:title", content: "Smart Pole – Control Dashboard" },
      { property: "og:description", content: "Real-time smart city monitoring, AI surveillance, and intelligent lighting control." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 md:ml-60 transition-all duration-300">
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.17 0.02 260)",
            border: "1px solid oklch(0.3 0.03 260 / 50%)",
            color: "oklch(0.93 0.01 250)",
          },
        }}
      />
    </div>
  );
}
