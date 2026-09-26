import { ref } from 'vue';

/**
 * Composable untuk menangani aksi Tekan Lama (Long-Press)
 * Mendukung perangkat sentuh (touchscreen HP) dan mouse desktop
 */
export function useLongPress(callback, duration = 800) {
  let pressTimer = null;
  const isPressing = ref(false);

  function start(e) {
    if (e.type === 'mousedown' && e.button !== 0) return; // Hanya klik kiri
    isPressing.value = true;
    if (pressTimer) clearTimeout(pressTimer);
    
    pressTimer = setTimeout(() => {
      isPressing.value = false;
      // Getar perangkat jika didukung
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch (_) {}
      }
      callback();
    }, duration);
  }

  function stop() {
    isPressing.value = false;
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  }

  return {
    isPressing,
    longPressProps: {
      onMousedown: start,
      onMouseup: stop,
      onMouseleave: stop,
      onTouchstart: start,
      onTouchend: stop,
      onTouchcancel: stop,
      onContextmenu: (e) => e.preventDefault()
    }
  };
}
