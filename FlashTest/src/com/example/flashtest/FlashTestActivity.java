package com.example.flashtest;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebView;

@SuppressLint("ResourceAsColor")
public class FlashTestActivity extends Activity {

	private WebView mWebView;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_flash_test);
		
		init();
	}

	private void init() {
		findViewById(R.id.btn_flash_white).setOnClickListener(mClickListener);
		findViewById(R.id.btn_flash_slide).setOnClickListener(mClickListener);
	}
	
	private OnClickListener mClickListener = new OnClickListener() {
		@Override
		public void onClick(View v) {
			Intent intent = new Intent();
			switch (v.getId()) {
			case R.id.btn_flash_white:
				intent.setClass(getApplicationContext(), FlashWhiteActivity.class);
				startActivity(intent);
				break;
			case R.id.btn_flash_slide:
				intent.setClass(getApplicationContext(), FlashSlideActivity.class);
				startActivity(intent);
				break;
			default:
				break;
			}
		}
	};
}
