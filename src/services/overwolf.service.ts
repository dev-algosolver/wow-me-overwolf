
export const getCurrentWindow = (): Promise<any> => {
  return new Promise<any>(resolve => {
    try {
      overwolf.windows.getCurrentWindow((res: any) => {
        resolve(res.window);
      });
    } catch (e) {
      console.warn('Exception while getting current window window');
      resolve(null);
    }
  });
}

export const dragResize = (windowId: string, edge: overwolf.windows.enums.WindowDragEdge) => {
  overwolf.windows.dragResize(windowId, edge);
}
