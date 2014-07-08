package com.example.flash_webview;

import com.example.utils.AssetUtils;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.webkit.WebView;

public class WebViewLoadFileActivity extends Activity {
	private static final String TAG = WebViewLoadFileActivity.class.getSimpleName();
	
	private WebView mWebView;
	private String mHtmlPath = "file:///sdcard/a.html";
	private String mSwfPath  = "file:///sdcard/a.swf";
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_webview_load_file);
		
		init();
	}

	private void init() {
		AssetUtils.copyFile(getAssets(), "a.html", "/sdcard/a.html");
		AssetUtils.copyFile(getAssets(), "a.swf", "/sdcard/a.swf");
		
		findViewById(R.id.btn_back).setOnClickListener(mBtnClickListener);
		mWebView = (WebView)findViewById(R.id.wv_webview);
		WebViewSet.settings(mWebView);
		FullscreenableChromeClient mFullscreenableChromeClient = new FullscreenableChromeClient(this);
//		mWebView.setWebViewClient(new MyWebViewClient());
		mWebView.setWebChromeClient(mFullscreenableChromeClient);
		mWebView.loadUrl(mHtmlPath);
	}
	
	private OnClickListener mBtnClickListener = new OnClickListener() {
		@Override
		public void onClick(View v) {
			switch (v.getId()) {
			case R.id.btn_back:
				finish();
				break;
			default:
				break;
			}
		}
	};
	
	@Override
	protected void onResume() {
		mWebView.onResume();
		super.onResume();
	};
	
	@Override
	protected void onPause() {
		mWebView.onPause();
		super.onPause();
	}
	
	@Override
	protected void onDestroy() {
		ViewGroup vg = (ViewGroup) mWebView.getParent();
		vg.removeView(mWebView);
		mWebView.removeAllViews();
		mWebView.destroy();
		super.onDestroy();
	}
}
