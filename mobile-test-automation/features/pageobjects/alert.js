// Native Android alert dialog
class NativeAlert {
  get title() { return $('id=com.wdiodemoapp:id/alert_title'); }
  get message() { return $('id=android:id/message'); }
  get okButton() { return $('id=android:id/button1'); }

  async waitForShown() {
    await this.title.waitForDisplayed();
  }

  async isShown() {
    return this.title.isExisting();
  }

  async close() {
    await this.okButton.click();
    await this.title.waitForDisplayed({ reverse: true });
  }
}

module.exports = new NativeAlert();
