package com.example.flashtest;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebView;

@SuppressLint("ResourceAsColor")
public class FlashWhiteActivity extends Activity {

	private WebView mWebView;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_flash_white);
		
		init();
	}

	private void init() {
		mWebView = (WebView)findViewById(R.id.wv_webview);
		WebViewSet.settings(mWebView);
		mWebView.setBackgroundColor(android.R.color.black);
//		mWebView.setBackgroundColor(android.R.color.transparent);
		
		findViewById(R.id.btn_load_swf).setOnClickListener(mClickListener);
		findViewById(R.id.btn_load_html).setOnClickListener(mClickListener);
		loadSwf();
	}
	
	private OnClickListener mClickListener = new OnClickListener() {
		@Override
		public void onClick(View v) {
			switch (v.getId()) {
			case R.id.btn_load_swf:
				loadSwf();
				break;
			case R.id.btn_load_html:
				loadHtml();
				break;
			default:
				break;
			}
		}
	};
	
	private void loadSwf() {
		mWebView.loadUrl("file:///android_asset/s.swf");
	}
	
	private void loadHtml() {
		mWebView.loadUrl("file:///android_asset/s.html");
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
