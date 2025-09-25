import type { Metadata } from 'next'
import './globals.css'
import { TelegramProvider } from '@/components/TelegramProvider'

export const metadata: Metadata = {
  title: 'Cargo TMA',
  description: 'Telegram Mini App for cargo delivery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TelegramProvider>
          {children}
        </TelegramProvider>

        {/* Eruda Debug Tool */}
        <button id="debug-toggle"
          style={{
            position: 'fixed',
            right: '12px',
            bottom: '12px',
            zIndex: 999999,
            padding: '10px 12px',
            borderRadius: '999px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,.2)',
            background: '#111',
            color: '#fff',
            font: '600 12px/1 system-ui,Segoe UI,Roboto,sans-serif',
            cursor: 'pointer'
          }}>
          Dev
        </button>

        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  const isDebug = /(?:\\?|&)debug\\b/.test(location.search);
  let erudaLoaded = false;
  
  console.log('Debug mode check:', isDebug, 'URL:', location.search);

  function loadEruda(cb) {
    if (erudaLoaded) return cb && cb();
    console.log('Loading Eruda debug tool...');
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/eruda';
    s.onload = function () {
      console.log('Eruda loaded successfully');
      eruda.init({
        tool: ['console','elements','network','resources','info','snippets'],
        defaults: { displaySize: 60, transparency: 0.95, theme: 'Monokai Pro' }
      });
      erudaLoaded = true;
      cb && cb();
    };
    s.onerror = function () { 
      console.error('Failed to load Eruda');
      alert('Failed to load eruda'); 
    };
    document.head.appendChild(s);
  }

  function toggleEruda() {
    if (!erudaLoaded) {
      loadEruda(() => eruda.show());
      return;
    }
    // Toggle
    if (eruda._devTools && eruda._devTools._isShow) eruda.hide();
    else eruda.show();
  }

  // Wait for DOM to be ready
  function initDebug() {
    const btn = document.getElementById('debug-toggle');
    if (!btn) {
      console.error('Debug button not found');
      return;
    }

    // Button behavior
    btn.addEventListener('click', toggleEruda);

    // Auto-open if ?debug is present
    if (isDebug) {
      btn.style.opacity = '1';
      loadEruda(() => eruda.show());
    } else {
      // show the pill only after long-press (3s) on body to avoid accidental exposure
      btn.style.opacity = '0.2';
      let pressTimer;
      document.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => (btn.style.opacity = '1'), 3000);
      }, {passive:true});
      document.addEventListener('touchend', () => clearTimeout(pressTimer));
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebug);
  } else {
    initDebug();
  }
})();
                        `
          }}
        />
      </body>
    </html>
  )
}
