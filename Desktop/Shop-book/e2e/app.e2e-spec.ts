import { BookPage } from './app.po';

describe('book App', () => {
  let page: BookPage;

  beforeEach(() => {
    page = new BookPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
