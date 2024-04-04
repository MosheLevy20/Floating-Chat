const { app, globalShortcut, BrowserWindow, screen, ipcMain } = require('electron');

const OpenAI = require('openai');

const openai = new OpenAI();
ipcMain.on('create-completion', async (event, messages) => {
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4",
    });
    event.returnValue = completion;
  });
let win;

function createWindow() {
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({
        x: width - 400, // 400 is the width of the window
        y: 0,
        width: 400,
        height: 400,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        focusable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
    win.hide(); // Start with the window hidden

    globalShortcut.register('CommandOrControl+Shift+Y', () => {
        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
            win.focus();
            // Attempt to make the window appear over full screen apps
            win.setAlwaysOnTop(true, 'floating');
            win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
            win.setFullScreenable(false);
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
