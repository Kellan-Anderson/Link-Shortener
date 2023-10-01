export function generateAlias(length=6) {
  const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  let alias = '';
  for(let i = 0; i < length; i++) {
    const randNum = Math.floor(Math.random() * key.length);
    alias = alias + key[randNum];
  }
  return alias;
}