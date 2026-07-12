export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // معالجة طلبات FYP فقط
    if (url.pathname === '/lite/v2/feed/fyp/' && request.method === 'POST') {
      try {
        // قراءة الجسم والهيدرات من طلب التطبيق
        const body = await request.text();
        const headers = new Headers(request.headers);

        // حذف هيدرات قد تعطل إعادة التوجيه
        headers.delete('host');
        headers.delete('content-length');
        headers.delete('accept-encoding');

        // بناء الرابط الجديد إلى خادم تيك توك (نفس المسار مؤقتاً)
        const targetUrl = 'https://api22-core-c-alisg.tiktokv.com/lite/v2/feed/fyp/?' + url.searchParams.toString();

        // إرسال الطلب إلى تيك توك
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: headers,
          body: body
        });

        // إعادة الرد للتطبيق
        return new Response(response.body, {
          status: response.status,
          headers: response.headers
        });
      } catch (error) {
        return new Response(JSON.stringify({ status_code: 1 }), { status: 502 });
      }
    }

    // لأي مسار آخر، أرجع خطأ
    return new Response('Not Found', { status: 404 });
  }
}
