# Root: The Woodland Companion

A helper app for Root: a Game of Woodland Might and Right.

All rights for images and other assets go to Leder Games.

Resources:
- [BoardGameGeek FAQ](https://boardgamegeek.com/thread/2038847/official-faq-and-guide-reading-rules)
- [FAQ Document](https://docs.google.com/document/d/1usz2D3BCurx2nKEOtDseCwNaFL7vOArvGHdrIt_KPio/edit)

## Want to Contribute Rules/FAQ?

Here are where those files are located:

* [The Rules](https://github.com/seiyria/root/blob/master/src/assets/i18n/rules/)
* [The FAQ](https://github.com/seiyria/root/blob/master/src/assets/i18n/faq/)

### Adding a New Language

To add a new language, you need to edit a handful of files.

1. Add a corresponding language file [in this folder](https://github.com/seiyria/root/blob/master/src/assets/i18n/rules/)
1. Add a corresponding language file [in this folder](https://github.com/Vagabottos/root/blob/master/src/assets/i18n/)
1. Add an import and usage [in this file](https://github.com/Vagabottos/root/blob/master/src/app/app.module.ts)
1. Add an import and usage [in this file](https://github.com/Vagabottos/root/blob/master/src/app/rules.service.ts)
1. Add an import and usage [in this file](https://github.com/Vagabottos/root/blob/master/src/app/app.component.html)
1. If you're adding FAQ files, add a corresponding language file [in this folder](https://github.com/seiyria/root/blob/master/src/assets/i18n/faq/)
1. If you're adding FAQ files, add an import and usage [in this file](https://github.com/Vagabottos/root/blob/master/src/app/faqmodal/faqmodal.page.ts)

## Want to Contribute to the Discord Bot?

You can find the Discord bot [over here](https://github.com/seiyria/rootbot).
