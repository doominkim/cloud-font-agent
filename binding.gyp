{
  "targets": [
    {
      "target_name": "font_bridge",
      "sources": ["native/font_bridge.mm"],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "xcode_settings": {
        "OTHER_CFLAGS": ["-ObjC++", "-std=c++17"],
        "MACOSX_DEPLOYMENT_TARGET": "10.13"
      },
      "link_settings": {
        "libraries": [
          "-framework CoreText",
          "-framework Foundation"
        ]
      },
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"]
    }
  ]
}
