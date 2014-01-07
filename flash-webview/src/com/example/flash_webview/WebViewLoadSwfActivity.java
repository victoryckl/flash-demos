package com.example.flash_webview;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.EditText;
import android.widget.Toast;

public class WebViewLoadSwfActivity extends Activity {
	private static final String TAG = WebViewLoadSwfActivity.class.getSimpleName();
	
	private WebView mWebView;
	private EditText mEtPath;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_webview_load_swf);
		
		init();
	}

	private void init() {
		findViewById(R.id.btn_choose_file).setOnClickListener(mBtnClickListener);
		findViewById(R.id.btn_play).setOnClickListener(mBtnClickListener);
		mEtPath = (EditText)findViewById(R.id.et_path);
		
		mWebView = (WebView)findViewById(R.id.wv_webview);
		WebViewSet.settings(mWebView);
		play();
	}
	
	private OnClickListener mBtnClickListener = new OnClickListener() {
		@Override
		public void onClick(View v) {
			switch (v.getId()) {
			case R.id.btn_choose_file:
				chooseFile();
				break;
			case R.id.btn_play:
				play();
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
	
	//-----------------------
	private void play() {
		String swf = getPath();
		if (swf == null) {
			return ;
		}
		mWebView.loadUrl("file://"+swf);
	}
	
	//-----------------------
	private String getPath() {
		String path = null;

		path = mEtPath.getText().toString();
		if (path == null || path.length() <= 0) {
			Toast.makeText(getApplicationContext(), "请选择文件", Toast.LENGTH_SHORT).show();
			path = null;
		} else {
			Log.i(TAG, "getPath(): " + path);
		}
		
		return path;
	}
	
	private static final int FILE_SELECT_CODE = 0;
	private void chooseFile() {
		Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
		intent.setType("*/*");
		intent.addCategory(Intent.CATEGORY_OPENABLE);
		try {
			startActivityForResult(Intent.createChooser(intent, "请选择多html文件"), FILE_SELECT_CODE);
		} catch (android.content.ActivityNotFoundException ex) {
			Toast.makeText(getApplicationContext(), "亲，木有文件管理器-_-!", Toast.LENGTH_SHORT).show();
		}
	}
	
	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (resultCode != Activity.RESULT_OK) {
			Log.e(TAG, "onActivityResult() error, resultCode: " + resultCode);
			super.onActivityResult(requestCode, resultCode, data);
			return;
		}
		if (requestCode == FILE_SELECT_CODE) {
			Uri uri = data.getData();
			Log.i(TAG, "------->" + uri.getPath());
			mEtPath.setText(uri.getPath());
		}
		super.onActivityResult(requestCode, resultCode, data);
	}
}
