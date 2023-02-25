set CFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough &
set CXXFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough &
set CPPFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough &
set LDFLAGS=-Wl,-O3 -mavx -maes &

mkdir %USERPROFILE%\.atom\.node-gyp &
copy gitconfig %USERPROFILE%\.atom\.node-gyp\.gitconfig &

script\build.cmd
