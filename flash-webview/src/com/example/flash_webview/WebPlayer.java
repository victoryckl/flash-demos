package com.example.flash_webview;

import java.util.ArrayList;
import java.util.List;

import android.os.Bundle;
import android.app.Activity;
import android.graphics.Color;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebSettings.PluginState;

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
		List<String> l = new ArrayList<String>();
		
	}
	
	private void webSettings(WebView view) {
		WebSettings s = view.getSettings();
		
		s.setJavaScriptEnabled(true);
		s.setPluginState(PluginState.ON);
		s.setTextZoom(100);
		
		view.setBackgroundColor(0xffffff00);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.activity_flash_webview, menu);
		return true;
	}
	
	@Override
	public boolean onMenuItemSelected(int featureId, MenuItem item) {
		switch (item.getOrder()) {
		case 100:
			Log.i(TAG, item.toString());
			WebPlayer.this.finish();
			break;

		default:
			break;
		}
		return super.onMenuItemSelected(featureId, item);
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
