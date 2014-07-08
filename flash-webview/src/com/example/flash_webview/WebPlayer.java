package com.example.flash_webview;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;

public class WebPlayer extends Activity {

	private static final String TAG = WebPlayer.class.getSimpleName();
	
	private WebView mWebView;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.webplayer);
		
		mWebView = (WebView)findViewById(R.id.webveiw);
		webSettings(mWebView);
		mWebView.loadUrl("file:///android_asset/short.html");
	}
	
	private void webSettings(WebView view) {
		WebSettings s = view.getSettings();
		
		s.setJavaScriptEnabled(true);
		s.setPluginState(PluginState.ON);
		s.setTextZoom(100);
		
		view.setBackgroundColor(0xffffff00);
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		mWebView.resumeTimers();
	}
	
	@Override
	protected void onPause() {
		mWebView.pauseTimers();
		super.onPause();
	}
	
	@Override
	protected void onDestroy() {
		mWebView.destroy();
		super.onDestroy();
	}
}
