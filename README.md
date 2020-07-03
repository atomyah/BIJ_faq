src/environments/environment.ts
```ts
export const environment = {
    production: false,
    firebase : {
        apiKey: "",
        authDomain: "xxxx.firebaseapp.com",
        databaseURL: "https://xxxxx.firebaseio.com",
        projectId: "xxxxxx",
        storageBucket: "xxxxx.appspot.com",
        messagingSenderId: "1111111",
        appId: "1:xxxxxx-------",
        measurementId: "G-xxxxxx"
    },
    algolia: {
        apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        appId: 'Txxxxxx',
        indexName: 'prod_xxxxxx',
    }
};
```

src/environments/environment.prod.ts
```ts
export const environment = {
    production: true,
    firebase : {
        apiKey: "",
        authDomain: "xxxx.firebaseapp.com",
        databaseURL: "https://xxxxx.firebaseio.com",
        projectId: "xxxxxx",
        storageBucket: "xxxxx.appspot.com",
        messagingSenderId: "1111111",
        appId: "1:xxxxxx-------",
        measurementId: "G-xxxxxx"
    },
    algolia: {
        apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        appId: 'Txxxxxx',
        indexName: 'prod_xxxxxx',
    }
};
```