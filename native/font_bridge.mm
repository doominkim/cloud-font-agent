#import <CoreText/CoreText.h>
#import <Foundation/Foundation.h>
#include <napi.h>
#include <vector>
#include <string>

// Track registered font URLs for cleanup
static std::vector<std::string> registeredFontPaths;

Napi::Value RegisterFont(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // Validate arguments
  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "String expected for font path").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  std::string fontPath = info[0].As<Napi::String>().Utf8Value();
  
  // Convert to NSURL
  NSString* nsPath = [NSString stringWithUTF8String:fontPath.c_str()];
  NSURL* fontURL = [NSURL fileURLWithPath:nsPath];
  
  if (!fontURL) {
    Napi::Error::New(env, "Invalid font path").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  // Register font with user scope (available to all apps)
  // Requirement 3.1: Fonts must be available in all macOS applications
  CFErrorRef error = NULL;
  bool success = CTFontManagerRegisterFontsForURL(
    (__bridge CFURLRef)fontURL,
    kCTFontManagerScopeUser,
    &error
  );
  
  if (!success) {
    NSString* errorDesc = @"Unknown error";
    if (error) {
      errorDesc = [(__bridge NSError*)error localizedDescription];
      CFRelease(error);
    }
    
    std::string errorMsg = "Failed to register font: " + std::string([errorDesc UTF8String]);
    Napi::Error::New(env, errorMsg).ThrowAsJavaScriptException();
    return env.Null();
  }
  
  // Track registered font
  registeredFontPaths.push_back(fontPath);
  
  return Napi::Boolean::New(env, true);
}

Napi::Value UnregisterFont(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // Validate arguments
  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "String expected for font path").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  std::string fontPath = info[0].As<Napi::String>().Utf8Value();
  
  // Convert to NSURL
  NSString* nsPath = [NSString stringWithUTF8String:fontPath.c_str()];
  NSURL* fontURL = [NSURL fileURLWithPath:nsPath];
  
  if (!fontURL) {
    Napi::Error::New(env, "Invalid font path").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  // Unregister font from user scope
  CFErrorRef error = NULL;
  bool success = CTFontManagerUnregisterFontsForURL(
    (__bridge CFURLRef)fontURL,
    kCTFontManagerScopeUser,
    &error
  );
  
  if (!success) {
    NSString* errorDesc = @"Unknown error";
    if (error) {
      errorDesc = [(__bridge NSError*)error localizedDescription];
      CFRelease(error);
    }
    
    std::string errorMsg = "Failed to unregister font: " + std::string([errorDesc UTF8String]);
    Napi::Error::New(env, errorMsg).ThrowAsJavaScriptException();
    return env.Null();
  }
  
  // Remove from tracking
  auto it = std::find(registeredFontPaths.begin(), registeredFontPaths.end(), fontPath);
  if (it != registeredFontPaths.end()) {
    registeredFontPaths.erase(it);
  }
  
  return Napi::Boolean::New(env, true);
}

Napi::Value UnregisterAllFonts(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  int successCount = 0;
  int failCount = 0;
  
  // Unregister all tracked fonts
  for (const auto& fontPath : registeredFontPaths) {
    NSString* nsPath = [NSString stringWithUTF8String:fontPath.c_str()];
    NSURL* fontURL = [NSURL fileURLWithPath:nsPath];
    
    if (fontURL) {
      CFErrorRef error = NULL;
      bool success = CTFontManagerUnregisterFontsForURL(
        (__bridge CFURLRef)fontURL,
        kCTFontManagerScopeUser,
        &error
      );
      
      if (success) {
        successCount++;
      } else {
        failCount++;
        if (error) {
          CFRelease(error);
        }
      }
    }
  }
  
  // Clear tracking list
  registeredFontPaths.clear();
  
  // Return result object
  Napi::Object result = Napi::Object::New(env);
  result.Set("success", Napi::Number::New(env, successCount));
  result.Set("failed", Napi::Number::New(env, failCount));
  
  return result;
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
