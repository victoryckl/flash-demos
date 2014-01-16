package com.example.flashtest;

import android.annotation.SuppressLint;
import android.webkit.WebSettings;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;

@SuppressLint({ "ResourceAsColor", "NewApi" })
public class WebViewSet {
	public static void settings(WebView view) {
		WebSettings s = view.getSettings();
//		s.setJavaScriptCanOpenWindowsAutomatically(true);
		s.setJavaScriptEnabled(true);
		s.setPluginState(PluginState.ON);
		s.setTextZoom(100);
	}
}
