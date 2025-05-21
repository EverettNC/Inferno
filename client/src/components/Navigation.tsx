import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-soft py-2 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-around items-center">
          <Link href="/">
            <a className={`flex flex-col items-center p-2 ${location === "/" ? "text-primary-600" : "text-neutral-500 hover:text-primary-600"} transition`}>
              <i className="fas fa-home text-xl"></i>
              <span className="text-xs mt-1">Home</span>
            </a>
          </Link>
          
          <Link href="/grounding">
            <a className={`flex flex-col items-center p-2 ${location === "/grounding" ? "text-primary-600" : "text-neutral-500 hover:text-primary-600"} transition`}>
              <i className="fas fa-hand-sparkles text-xl"></i>
              <span className="text-xs mt-1">Ground</span>
            </a>
          </Link>
          
          <Link href="/chat">
            <a className={`flex flex-col items-center p-2 ${location === "/chat" ? "text-primary-600" : "text-neutral-500 hover:text-primary-600"} transition`}>
              <i className="fas fa-comment-alt text-xl"></i>
              <span className="text-xs mt-1">Chat</span>
            </a>
          </Link>
          
          <Link href="/resources">
            <a className={`flex flex-col items-center p-2 ${location === "/resources" ? "text-primary-600" : "text-neutral-500 hover:text-primary-600"} transition`}>
              <i className="fas fa-graduation-cap text-xl"></i>
              <span className="text-xs mt-1">Learn</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
