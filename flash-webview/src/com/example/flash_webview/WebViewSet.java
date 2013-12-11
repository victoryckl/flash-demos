package com.example.flash_webview;

import android.webkit.WebSettings;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;

public class WebViewSet {
	public static void settings(WebView view) {
		WebSettings s = view.getSettings();
		s.setJavaScriptCanOpenWindowsAutomatically(true);
		s.setPluginState(PluginState.ON);
		s.setTextZoom(100);
	}
}
