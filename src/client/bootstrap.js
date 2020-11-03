function hexStrToArrayBuffer(hexStr) {
  return new Uint8Array(
    hexStr.match(/.{1,2}/g).map((byte) => {
      return parseInt(byte, 16);
    }),
  );
}

window.addEventListener('load', () => {
  setTimeout(() => {
    window.crypto.subtle
      .importKey(
        'raw',
        hexStrToArrayBuffer('__key_buffer_hex__'),
        { name: 'AES-CBC' },
        false,
        ['encrypt', 'decrypt'],
      )
      .then((key) => {
        // CryptoKey

        const iv = hexStrToArrayBuffer('__iv_buffer_hex__');

        console.log(document.cookie);

        const allNumbers = (str) => /^\d+$/.test(str);

        // const cookieObj0 =
        // document.cookie
        // .split(/\s*;\s*/)
        // .map(keyValuePair => keyValuePair.split(/\s*=\s*/))
        // .reduce((obj, keyValueTuple) => {
        //   let val = decodeURIComponent(keyValueTuple[1]);
        //   if (/^[sj]:/.test(val)) {
        //     val = val.substr(2, val.lastIndexOf('.') - 2);
        //   }
        //   obj[decodeURIComponent(keyValueTuple[0])] = val;
        //   return obj;
        // }, {});
        // console.log(cookieObj0);

        // const cookieObj1 =
        // Object.fromEntries(
        //   document.cookie
        //   .split(/\s*;\s*/)
        //   .map(keyValuePair => {
        //     const [ key, ...v ] = keyValuePair.split(/\s*=\s*/).map(decodeURIComponent);
        //     return [ key, v.join('=') ];
        //     // assumes value can contain space char (?!)
        //     // ... but encodeURIComponent('=') === "%3D" so this is unnecessary.
        //   }
        // ));
        // console.log(cookieObj1);

        const cookieObj2 = document.cookie
          .split(/\s*;\s*/)
          .reduce((obj, keyValuePair) => {
            let [key, val] = keyValuePair.split(/\s*=\s*/);
            key = decodeURIComponent(key);
            val = decodeURIComponent(val);
            if (/^[sj]:/.test(val)) {
              val = val.substr(2, val.lastIndexOf('.') - 2);
            }
            try {
              obj[key] = allNumbers(val) ? val : JSON.parse(val);
            } catch (_err) {
              obj[key] = val;
            }
            return obj;
          }, {});
        console.log(cookieObj2);

        const base64ToDecrypt = cookieObj2.access_token;
        const hexToDecrypt = window.atob(base64ToDecrypt);
        const buffToDecrypt = hexStrToArrayBuffer(hexToDecrypt);

        window.crypto.subtle
          .decrypt(
            {
              name: 'AES-CBC',
              iv,
            },
            key,
            buffToDecrypt,
          )
          .then((decrypted) => {
            // ArrayBuffer
            // const arg = String.fromCharCode.apply(null, new Uint8Array(decrypted));
            const arg = new Uint8Array(decrypted).reduce((data, byte) => {
              return data + String.fromCharCode(byte);
            }, '');
            console.log(arg); // access_token

            window.crypto.subtle
              .importKey(
                'raw',
                hexStrToArrayBuffer('__key_buffer_hex__'),
                { name: 'AES-CBC' },
                false,
                ['encrypt', 'decrypt'],
              )
              .then((key) => {
                // CryptoKey
                const access_token = arg;
                const textEncoder = new TextEncoder('utf-8');
                const iv = textEncoder.encode(access_token).slice(0, 16); // Uint8Array

                const base64ToDecrypt = '__encryptedBase64__';
                const hexToDecrypt = window.atob(base64ToDecrypt);
                const buffToDecrypt = hexStrToArrayBuffer(hexToDecrypt);

                window.crypto.subtle
                  .decrypt(
                    {
                      name: 'AES-CBC',
                      iv,
                    },
                    key,
                    buffToDecrypt,
                  )
                  .then((decrypted) => {
                    // ArrayBuffer
                    // const arg = String.fromCharCode.apply(null, new Uint8Array(decrypted));
                    const arg = new Uint8Array(decrypted).reduce(
                      (data, byte) => {
                        return data + String.fromCharCode(byte);
                      },
                      '',
                    );
                    // console.log(arg);

                    document.write(arg);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });

        /*
        const strToEncrypt = '';
        const textEncoder = new TextEncoder("utf-8");
        const strToEncryptEncoded = textEncoder.encode(strToEncrypt); // Uint8Array
        
        window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv
            },
            key,
            strToEncryptEncoded
        ).then((encrypted) => { // ArrayBuffer
            // const arg = String.fromCharCode.apply(null, new Uint8Array(encrypted));
            const arg = new Uint8Array(encrypted).reduce((data, byte) => {
                return data + String.fromCharCode(byte);
            }, '');
            const encryptedB64 = window.btoa(arg);
    
            // const url = location.origin + encodeURIComponent_RFC3986(encryptedB64);
            // location.href = url;
        }).catch((err) => {
            console.log(err);
        });
        */
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000); // 1000 === 1s for testing
});
