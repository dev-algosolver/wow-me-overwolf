import { OWWindow } from "@overwolf/overwolf-api-ts";

// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared accross the desktop and in-game windows.
export class AppWindow {
  protected currWindow: OWWindow;
  protected mainWindow: OWWindow;
  protected maximized: boolean = false;

  constructor(windowName) {
    this.mainWindow = new OWWindow('background');
    this.currWindow = new OWWindow(windowName);

    const closeButton = document.getElementById('closeButton');
    // const maximizeButton = document.getElementById('maximizeButton');
    const minimizeButton = document.getElementById('minimizeButton');

    const header = document.getElementById('header');

    this.setDrag(header);

    closeButton.addEventListener('click', () => {
      console.log('closeButton clicked')
      this.mainWindow.close();
    });

    minimizeButton.addEventListener('click', () => {
      console.log('minimizeButton clicked')
      this.currWindow.minimize();
    });

    // maximizeButton.addEventListener('click', () => {
    //   const img = document.getElementById("maximize-img");
    //   if (!this.maximized) {
    //     this.currWindow.maximize();
    //     img.setAttribute('src', '/img/in-game-window/button/restore.png');
    //   } else {
    //     this.currWindow.restore();
    //     img.setAttribute('src', '/img/in-game-window/button/maximize.png');
    //   }

    //   this.maximized = !this.maximized;
    // });
  }

  public closeWindow() {
    this.mainWindow.close();
  }

  public async getWindowState() {
    return await this.currWindow.getWindowState();
  }

  private async setDrag(elem) {
    this.currWindow.dragMove(elem);
  }
}
