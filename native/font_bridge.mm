#import <CoreText/CoreText.h>
#import <Foundation/Foundation.h>
#include <napi.h>

// Placeholder for native module implementation
// Will be implemented in task 2

Napi::Value RegisterFont(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // TODO: Implement font registration
  return Napi::Boolean::New(env, false);
}

Napi::Value UnregisterFont(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // TODO: Implement font unregistration
  return Napi::Boolean::New(env, false);
}

Napi::Value UnregisterAllFonts(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // TODO: Implement unregister all fonts
  return Napi::Boolean::New(env, false);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "registerFont"),
              Napi::Function::New(env, RegisterFont));
  exports.Set(Napi::String::New(env, "unregisterFont"),
              Napi::Function::New(env, UnregisterFont));
  exports.Set(Napi::String::New(env, "unregisterAllFonts"),
              Napi::Function::New(env, UnregisterAllFonts));
  return exports;
}

NODE_API_MODULE(font_bridge, Init)
