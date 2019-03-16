require 'sinatra'
require 'uri'
require 'json'
require 'net/http'
require 'logger'
require 'benchmark'
require 'fileutils'

set :bind, '0.0.0.0'
logger = Logger.new(STDOUT)
is_real_send = true

if is_real_send
  # set SUBSCRIPTION_KEY in os environment variable with your valid subscription key.
  subscription_key = ENV['SUBSCRIPTION_KEY']
  unless subscription_key
    STDERR.puts('please set SUBSCRIPTION_KEY in os environment variable')
    exit 1
  end
end

get '/healthz' do
  return 'ok'
end

def send_ocr_request(url, subscription_key, image)
  req = Net::HTTP::Post.new(url.request_uri)
  req['Content-Type'] = 'application/octet-stream'
  req['Ocp-Apim-Subscription-Key'] = subscription_key
  req.body = image.read

  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE

  res = http.request(req)
  res
end

# Input: image file
# Output: title list(JSON format)
post '/ocr' do
  logger.info('request params: ' + params.to_s)

  image = params[:photo][:tempfile]
  FileUtils.cp(image, 'send_image.jpg')
  logger.info('file size: ' + File.size('send_image.jpg').to_s + '[byte]')

  if is_real_send
    uri = 'https://eastasia.api.cognitive.microsoft.com/vision/v2.0/ocr?language=ja'
    url = URI.parse(uri)

    res = nil
    req_time = Benchmark.realtime do
      res = send_ocr_request(url, subscription_key, image)
    end

    logger.info('ocr time: ' + req_time.to_s + '[sec]')

    unless res.code.to_i >= 200 && res.code.to_i < 300
      logger.warn('request OCR failed(' + res.code + '): ' + res.message)
    end

    return res.body
  else
    result = File.read('default.return.json')
    return result
  end
end
