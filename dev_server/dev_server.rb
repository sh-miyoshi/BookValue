require "sinatra"
require "uri"
require "json"
require "net/http"
require "logger"
require "benchmark"
require 'fileutils'

set :bind, "0.0.0.0"
logger = Logger.new(STDOUT)
isRealSend = false



# Input: image file
# Output: title list(JSON format)
post "/ocr" do
  logger.info("request params: " + params.to_s)

  image = params[:photo][:tempfile]
  FileUtils.cp(image, "send_image.jpg")

  if isRealSend then
    # set SUBSCRIPTION_KEY in os environment variable with your valid subscription key.
    subscriptionKey = ENV['SUBSCRIPTION_KEY']
    if !subscriptionKey then
      STDERR.puts("please set SUBSCRIPTION_KEY in os environment variable")
      exit 1
    end
    uri = "https://eastasia.api.cognitive.microsoft.com/vision/v2.0/ocr?language=ja"
    url = URI.parse(uri)

    req = Net::HTTP::Post.new(url.request_uri)
    req["Content-Type"] = "application/octet-stream"
    req["Ocp-Apim-Subscription-Key"] = subscriptionKey
    req.body = image.read

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  
    res = nil
    req_time = Benchmark.realtime do
      res = http.request(req)
    end

    logger.info("ocr time: " + req_time.to_s + "[sec]")

    if !(200 <= res.code.to_i && res.code.to_i < 300)
      logger.warn("request OCR failed(" + res.code+"): " + res.message)
      exit
    end

    return res.body
  else
    result = File.read('default.return.json')
    return result
  end
end
