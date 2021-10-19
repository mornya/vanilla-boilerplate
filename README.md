# Vanilla Boilerplate
A simple web server that can use vanilla scripts and TypeScript.

## Features
- [TypeScript](https://www.typescriptlang.org/) and ES6+ is supported by default WITHOUT using Babel.
- Use [Webpack](https://webpack.js.org/) v5 for code bundling. `webpack-dev-server` v4 to start a local server.
- Lint and test all of your codes with [Lintest CLI](https://npmjs.com/@lintest/cli).
- [Prettier](https://prettier.io/) is applied to generalize code formatting.

## Project Setup
린트/테스트를 수행하기 위해 lintest 라는 개발도구를 사용하였으므로 글로벌 영역에 설치해주세요.
```bash
$ npm install -g @lintest/cli

$ npm install

# 만약 IDE 내에서 린트 룰셋을 참조하기 위한 파일을 생성해야 할 때 실행해주세요.
$ lintest export

# 로컬 개발서버를 실행합니다.
$ npm start
```

### Directory structures
```
/
├── dist                    # 빌드 결과물 디렉토리
├── node_modules            # node.js 디펜던시 디렉토리
├── public                  # 정적 리소스 디렉토리 (빌드시 build 디렉토리에 복제)
├── src                     # 앱 소스 디렉토리
│   └── index.ts            # 앱 엔트리
├── test                    # 테스트케이스 디렉토리
│   ├── @setup.ts           # 테스트수행 공통 실행 코드
│   └── index.test.ts       # index 모듈 테스트케이스
├── types                   # 앱 전체 참조 타입 정의 디렉토리
├── .eslintignore           # ESLint 검사 미대상 파일 목록 정의
├── .gitignore              # git 예외목록 정의
├── .eslintrc               # 자동생성된 ESLint 룰셋 설정
├── .prettierrc             # prettier 적용 설정
├── build.ts                # 빌드 실행시 수행 (npm run build)
├── dev-server.config.ts    # webpack-dev-server 설정
├── LICENSE                 # 라이센스 파일
├── jest.config.json        # 자동생성된 Jest 설정
├── lintest.config.js       # Lintest 설정
├── package.json            # 앱 패키지 설정
├── package-lock.json       # NPM deps lock
├── README.md               # 현재 파일
├── server.ts               # 로컬개발을 위한 서버 구동시 수행 (npm start)
├── tsconfig.json           # 앱 타입스크립트 설정 (기본 확장)
├── tsconfig-cli.json       # CLI 전용 타입스크립트 설정 (기본 확장)
├── tsconfig-default.json   # 기본 타입스크립트 설정
└── webpack.config.ts       # webpack 설정
```

### 빌드환경 구성
빌드환경은 코드 번들링을 위해 `webpack (v5)` 및 로컬 개발 서버 기동을 위해 `webpack-dev-server (v4)`가 사용되었고 설정은 기본적인 부분만 되어있습니다.
- 빌드시 (npm run build) 결과물은 `/dist` 디렉토리에 생성.
- 엔트리포인트 파일은 `/index.js`.
- 코드 내 import 시 기본 확장자는 `*.ts`, `*.js` 파일만 인식되며, `/src`, `/node_modules` 순서로 모듈을 탐색.
- import 디렉토리 별칭으로 `~/*`는 `/` 디렉토리 기준, `@/*`는 `/src` 디렉토리 기준 절대경로로 인식됨.
- 트렌스파일에 사용될 로더는 타입스크립트 빌드를 위해 `ts-loader`, scss 컴파일을 위해 `scss-loader`/`css-loader`/`style-loader` 등을 추가.
- 사용 플러그인:
    - `CleanWebpackPlugin`: 빌드 디렉토리 내 파일을 삭제.
    - `CopyWebpackPlugin`: 빌드시 `/public` 디렉토리 내 파일 전체 복제.
    - `ForkTsCheckerWebpackPlugin`: 서버기동 후 개발진행하는 동안 코드 타입 체크를 할 수 있도록 함.
- 모든 설정파일 및 코드는 타입스크립트로 작성, 실행은 `ts-node`를 사용.
- `nodemon`으로 서버재시작 필요시 감지.

## 기타
- 코드 인벤션은 prettier 설정 및 린트 룰셋을 이용했습니다.
- 코드 린트/테스트를 위해 `Lintest` CLI를 사용했습니다.
  > 자세한 내용은 [여기를 클릭해주세요](https://www.npmjs.com/package/@lintest/cli).
- 린트는 `ESLint` 및 추가 플러그인을 이용하여 CLI에서 혹은 dev-server에서 코드검증을 실행합니다.
- 테스트케이스는 `Jest` 테스트도구를 이용합니다.
- 린트/테스트시 사용되는 설정인 `.eslintrc` 및 `jest.config.json` 파일은 `lintest export` 명령으로 추출되어 생성된 파일입니다.

### Available scripts
`package.json`에 정의된 `script` 항목에 대한 내용은 아래와 같습니다.

#### `postinstall` / `postuninstall`
Lintest CLI 를 실행하기 위한 기초작업을 수행합니다. npm install / uninstall 실행시 초기설정이 진행됩니다.

#### `build`
프로덕션 모드로 `build` 디렉토리에 리소스들을 번들링합니다.
```bash
$ npm run build
```

#### `start`
HMR/liveReload 등이 적용된 로컬 개발서버를 실행합니다.
```bash
$ npm start
```

#### `check`
타입스크립트 컴파일러를 실행하여 타입 오류 등에 대한 검증을 수행합니다.
```bash
$ npm run check
```

#### `lint`
Lintest CLI를 실행하여 코드 린트 체크합니다.
```bash
$ npm run lint
$ lintest lint
```

#### `lint:fix`
Lintest CLI를 실행하여 코드 린트 체크 및 자동교정합니다.
```bash
$ npm run lint:fix
$ lintest lint --fix
```

#### `test`
Lintest CLI를 실행하여 `Jest` 기동 및 테스트케이스를 수행합니다.
```bash
$ npm run test
$ lintest test
```

#### `test:watch`
Lintest CLI를 실행하여 watch mode로 테스트케이스를 수행합니다.
```bash
$ npm run test:watch
$ lintest test --watch
```

#### `test:coverage`
Lintest CLI를 실행하여 테스트 커버리지 데이터를 수집하여 `/coverage` 디렉토리에 출력합니다.
```bash
$ npm run test:coverage
$ lintest test --coverage
```

## License
프로젝트 라이센스는 [LICENSE](LICENSE) 파일 참조.
