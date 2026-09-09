# Shop Item Artwork

Product images for the EOS shop.

Full guide: [docs/CONTENT.md](../../../docs/CONTENT.md)

Name files after the shop item `id` when possible, e.g. `arcane-skin-pack.png`.

Then set `image` in `src/data/shop.ts`:

```ts
image: shopImagePath('arcane-skin-pack.png')
```
