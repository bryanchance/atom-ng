echo Bootstrapping `dot-atom/packages` with `npm install`... &

set CFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type &
set CXXFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type &
set CPPFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type &
set LDFLAGS=-Wl,-O3 -mavx -maes -s &
set VERBOSE=1 &
set V=1 &

set ELECTRON_CACHE=%~dp0%electron\bin &
set electron_config_cache=%~dp0%electron\bin &

cd dot-atom\packages &
cd atom-ng-browser &
npm install &
cd .. &
cd color-picker &
npm install &
cd .. &
cd minimap &
npm install &
npm run build &
npm run build-commit &
cd .. &
cd ..
