import { useEffect } from 'react';
import { useStore } from '../store';
import { Crosshair } from 'lucide-react';

export function HUD() {
  const score = useStore((state) => state.score);
  const speed = useStore((state) => state.speed);
  const boost = useStore((state) => state.boost);
  const timeLeft = useStore((state) => state.timeLeft);
  const isGameOver = useStore((state) => state.isGameOver);
  const resetGame = useStore((state) => state.resetGame);

  useEffect(() => {
    const timer = setInterval(() => {
        const state = useStore.getState();
        if (!state.isGameOver && state.timeLeft > 0) {
            useStore.setState({ timeLeft: state.timeLeft - 1 });
        } else if (state.timeLeft <= 0 && !state.isGameOver) {
            useStore.setState({ isGameOver: true });
        }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 font-sans flex flex-col justify-between p-8">
      {/* Top Bar: Score & Time */}
      <div className="flex justify-between w-full mt-4">
        <div className="bg-white/10 backdrop-blur-md rounded-full px-8 py-3 border border-white/20 shadow-lg flex flex-col items-center min-w-[200px]">
           <span className="text-white/60 text-xs uppercase tracking-widest font-bold">SCORE</span>
           <span className="text-4xl font-bold text-yellow-400 drop-shadow-md">{score.toLocaleString()}</span>
        </div>
        
        <div className={`bg-white/10 backdrop-blur-md rounded-full px-8 py-3 border shadow-lg flex flex-col items-center min-w-[200px] transition-colors duration-300 ${timeLeft <= 10 && !isGameOver ? 'border-red-500 bg-red-500/20' : 'border-white/20'}`}>
           <span className="text-white/60 text-xs uppercase tracking-widest font-bold">TIME LEFT</span>
           <span className={`text-4xl font-bold drop-shadow-md ${timeLeft <= 10 && !isGameOver ? 'text-red-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
        </div>
      </div>

      {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto bg-black/80 backdrop-blur-md border border-white/20 p-10 rounded-3xl flex flex-col items-center shadow-2xl text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
                  <h1 className="text-5xl font-black text-white mb-2 tracking-tight">TIME'S UP!</h1>
                  <p className="text-zinc-400 mb-8 text-lg">You scored <span className="text-yellow-400 font-bold text-2xl mx-1">{score.toLocaleString()}</span> points.</p>
                  <button 
                      onClick={resetGame}
                      className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-black rounded-full transition-all w-full text-xl uppercase tracking-widest shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] transform hover:scale-105"
                  >
                      Play Again
                  </button>
              </div>
          </div>
      )}

      {/* Reticle */}
      {!isGameOver && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50 mix-blend-screen">
             <Crosshair size={48} className="text-white" strokeWidth={1.5} />
          </div>
      )}

      {/* Bottom Bar: Boost & Speed */}
      <div className={`w-full max-w-lg mx-auto flex flex-col gap-2 mb-8 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl transition-opacity duration-500 ${isGameOver ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
         <div className="flex justify-between items-end mb-1">
             <div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-wider block">Speed</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">{Math.round(speed)} <span className="text-sm">km/h</span></span>
             </div>
             <div className="text-right">
                <span className="text-white/60 text-xs font-bold uppercase tracking-wider block">Boost Engine</span>
                <span className="text-orange-400 font-bold">{Math.round(boost)}%</span>
             </div>
         </div>
         {/* Boost Bar */}
         <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-100 ease-linear shadow-[0_0_10px_orange]" 
              style={{ width: `${boost}%` }}
            ></div>
         </div>
         
         <div className="text-center mt-2 text-white/50 text-xs tracking-wider font-semibold">
             Use W A S D / Arrows to fly. SPACE / SHIFT to boost.<br/>
             <span className="text-yellow-400/80">Rings = +100pts & +2s</span>
         </div>
      </div>
    </div>
  );
}
