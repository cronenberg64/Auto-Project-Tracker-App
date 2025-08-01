import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Check each shortcut
    Object.entries(shortcuts).forEach(([shortcut, action]) => {
      const [keyCombo, description] = shortcut.split('|');
      const [shortcutKey, shortcutCtrl, shortcutShift, shortcutAlt] = keyCombo.split('+');
      
      const keyMatch = key === shortcutKey.toLowerCase();
      const ctrlMatch = (shortcutCtrl === 'ctrl') === ctrl;
      const shiftMatch = (shortcutShift === 'shift') === shift;
      const altMatch = (shortcutAlt === 'alt') === alt;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        action(event);
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { handleKeyDown };
};

// Predefined shortcuts for common actions
export const commonShortcuts = {
  'n|ctrl': {
    action: () => window.showNotification?.info('New task shortcut pressed'),
    description: 'Create new task'
  },
  's|ctrl': {
    action: () => window.showNotification?.success('Save shortcut pressed'),
    description: 'Save project'
  },
  'l|ctrl': {
    action: () => window.showNotification?.info('Load shortcut pressed'),
    description: 'Load project'
  },
  'a|ctrl': {
    action: () => window.showNotification?.info('AI assistant shortcut pressed'),
    description: 'Toggle AI assistant'
  },
  'Escape': {
    action: () => window.showNotification?.info('Escape pressed'),
    description: 'Close modals/cancel actions'
  }
};

export const useCommonShortcuts = (actions) => {
  const shortcuts = {
    'n|ctrl': () => actions.createTask?.(),
    's|ctrl': () => actions.saveProject?.(),
    'l|ctrl': () => actions.loadProject?.(),
    'a|ctrl': () => actions.toggleAI?.(),
    'Escape': () => actions.escape?.(),
  };

  return useKeyboardShortcuts(shortcuts);
}; 