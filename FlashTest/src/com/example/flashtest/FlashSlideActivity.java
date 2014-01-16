package com.example.flashtest;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebView;

public class FlashSlideActivity extends Activity {

	private WebView mWebView;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_flash_slide);
		
		init();
	}

	private void init() {
		mWebView = (WebView)findViewById(R.id.wv_webview);
		WebViewSet.settings(mWebView);
		loadSwf();
	}
	
	private void loadSwf() {
		mWebView.loadUrl("file:///android_asset/h.swf");
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		mWebView.onResume();
	}
	
	@Override
	protected void onPause() {
		mWebView.onPause();
		super.onPause();
	}
}
