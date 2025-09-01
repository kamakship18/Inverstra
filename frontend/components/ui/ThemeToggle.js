import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
   <button
  aria-label="Toggle Dark/Light Mode"
  className="p-2 rounded-full border bg-white text-slate-900 hover:bg-slate-100 
             dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 
             transition fixed top-6 right-6 z-50"
  onClick={() => setTheme(isDark ? 'light' : 'dark')}
>
  {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
</button>
  );
}
