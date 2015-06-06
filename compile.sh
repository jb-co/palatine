rm -rf ./js/main.js
java -jar ./compiler.jar --js ./js/*.js --js_output_file ./js/main.js --formatting pretty_print --compilation_level WHITESPACE_ONLY
