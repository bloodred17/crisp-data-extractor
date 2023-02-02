import { HTTPResponse, Page } from "puppeteer";

export const delay =
  (timeout: number): Promise<void> =>
    new Promise((resolve) =>
      setTimeout(() => resolve(), timeout));


export function interceptor<T>(
  page: Page,
  interceptRoute: string,
  responseType: 'text' | 'json' | 'full',
  timeout: number,
  conditions?: ((response: HTTPResponse) => (boolean | Promise<boolean>))[],
): Promise<T> {
  const defaultCondition: (response: HTTPResponse) => boolean = (response: HTTPResponse) =>
    response.url().includes(interceptRoute);
  return Promise.race([
    new Promise<any>((resolve) => {
      page.on('response', async (response) => {
        let finalCondition: boolean = defaultCondition(response);
        if (conditions) {
          for (const condition of conditions) {
            finalCondition = finalCondition && await condition(response);
          }
        }
        if (finalCondition) {
          let data: any;
          try {
            switch (responseType) {
              case 'text':
                data = await response.text();
                break;
              case 'json':
                data = await response.json();
                break;
              case 'full':
                data = await response;
            }
            if (!data) {
              throw new Error('No result found');
            }
          } catch (e) {
            console.log(e);
          }
          resolve(data);
        }
      });
    }),
    new Promise<any>(function(resolve) {
      setTimeout(function() {
        resolve('TIMEOUT');
      }, timeout);
    }),
  ]);
}
