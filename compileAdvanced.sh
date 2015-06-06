rm -rf ./js/main.js
java -jar ./compiler.jar --js ./js/*.js --js_output_file ./js/main.js  --compilation_level ADVANCED_OPTIMIZATIONS
